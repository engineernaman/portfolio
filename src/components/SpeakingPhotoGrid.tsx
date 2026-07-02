import { SPEAKING_PHOTOS } from '@/data/speakingMedia';

const SpeakingPhotoGrid = () => (
  <div className="mb-10">
    <p className="label-cyber mb-4">Stage Gallery</p>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {SPEAKING_PHOTOS.map((photo) => (
        <figure
          key={photo.src}
          className="group relative overflow-hidden rounded-lg border border-white/10 bg-black/20 aspect-[4/5]"
        >
          <img
            src={photo.src}
            alt={photo.caption}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <figcaption className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/90 to-transparent">
            <p className="text-[10px] font-mono text-emerald-300/90 leading-tight">{photo.caption}</p>
          </figcaption>
        </figure>
      ))}
    </div>
  </div>
);

export default SpeakingPhotoGrid;
