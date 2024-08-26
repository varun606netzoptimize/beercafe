'use client'
import * as React from 'react'

import useEmblaCarousel from 'embla-carousel-react'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const CarouselContext = React.createContext(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />')
  }

  return context
}

const Carousel = React.forwardRef(
  ({ orientation = 'horizontal', opts, setApi, plugins, className, children, ...props }, ref) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === 'horizontal' ? 'x' : 'y'
      },
      plugins
    )

    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)

    const onSelect = React.useCallback(api => {
      if (!api) {
        return
      }

      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }, [])

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev()
    }, [api])

    const scrollNext = React.useCallback(() => {
      api?.scrollNext()
    }, [api])

    const handleKeyDown = React.useCallback(
      event => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault()
          scrollPrev()
        } else if (event.key === 'ArrowRight') {
          event.preventDefault()
          scrollNext()
        }
      },
      [scrollPrev, scrollNext]
    )

    React.useEffect(() => {
      if (!api || !setApi) {
        return
      }

      setApi(api)
    }, [api, setApi])

    React.useEffect(() => {
      if (!api) {
        return
      }

      onSelect(api)
      api.on('reInit', onSelect)
      api.on('select', onSelect)

      return () => {
        api?.off('select', onSelect)
      }
    }, [api, onSelect])

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation: orientation || (opts?.axis === 'y' ? 'vertical' : 'horizontal'),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn('relative', className)}
          role='region'
          aria-roledescription='carousel'
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }
)

Carousel.displayName = 'Carousel'

const CarouselContent = React.forwardRef(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div ref={carouselRef} className='overflow-hidden h-full'>
      <div
        ref={ref}
        className={cn(
          'flex duration-[50ms] transition-all ease-in',
          orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col',
          className
        )}
        {...props}
      />
    </div>
  )
})

CarouselContent.displayName = 'CarouselContent'

const CarouselItem = React.forwardRef(({ className, ...props }, ref) => {
  const { orientation } = useCarousel()

  return (
    <div
      ref={ref}
      role='group'
      aria-roledescription='slide'
      className={cn('min-w-0 shrink-0 grow-0 basis-full', orientation === 'horizontal' ? 'pl-4' : 'pt-4', className)}
      {...props}
    />
  )
})

CarouselItem.displayName = 'CarouselItem'

const CarouselPrevious = React.forwardRef(({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        'absolute  h-8 w-8 rounded-full',
        orientation === 'horizontal'
          ? '-left-12 top-1/2 -translate-y-1/2'
          : '-top-12 left-1/2 -translate-x-1/2 rotate-90',
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className='h-4 w-4' />
      <span className='sr-only'>Previous slide</span>
    </Button>
  )
})

CarouselPrevious.displayName = 'CarouselPrevious'

const CarouselNext = React.forwardRef(({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        'absolute h-8 w-8 rounded-full',
        orientation === 'horizontal'
          ? '-right-12 top-1/2 -translate-y-1/2'
          : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className='h-4 w-4' />
      <span className='sr-only'>Next slide</span>
    </Button>
  )
})

CarouselNext.displayName = 'CarouselNext'

const CarouselDots = React.forwardRef((props, ref) => {
  const { api } = useCarousel()
  const [updateState, setUpdateState] = React.useState(false)

  const toggleUpdateState = React.useCallback(() => setUpdateState(prevState => !prevState), [])

  React.useEffect(() => {
    if (api) {
      api.on('select', toggleUpdateState)
      api.on('reInit', toggleUpdateState)

      return () => {
        api.off('select', toggleUpdateState)
        api.off('reInit', toggleUpdateState)
      }
    }
  }, [api, toggleUpdateState])

  const numberOfSlides = api?.scrollSnapList().length || 0
  const currentSlide = api?.selectedScrollSnap() || 0

  if (numberOfSlides > 1) {
    return (
      <div ref={ref} className={`flex mt-2 justify-center ${props.className}`}>
        {Array.from({ length: numberOfSlides }, (_, i) => (
          <Button
            key={i}
            className={`mx-2 h-1 p-1 w-12 rounded-full cursor-pointer transition-all duration-500 ${
              i === currentSlide
                ? 'scale-125 w-28 transform mx-4 bg-slate-100 hover:bg-slate-100'
                : 'bg-gray-400 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => api?.scrollTo(i)}
          />
        ))}
      </div>
    )
  } else {
    return null
  }
})

CarouselDots.displayName = 'CarouselDots'

export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, CarouselDots }
