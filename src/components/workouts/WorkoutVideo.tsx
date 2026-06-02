interface WorkoutVideoProps {
  youtubeId: string
  title: string
}

export function WorkoutVideo({ youtubeId, title }: WorkoutVideoProps) {
  const src = `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-carbon-950 shadow-lg">
      <div className="relative aspect-video w-full">
        <iframe
          src={src}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </div>
  )
}
