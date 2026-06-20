import SectionHeader from './ui/SectionHeader';
import { certificationCategories, certificationNote } from '../data/portfolio';

const Certifications = () => (
  <section id="certifications" className="py-20 md:py-28 relative">
    <div className="container mx-auto px-6 max-w-6xl">
      <SectionHeader
        number="06b"
        title="Certifications"
        subtitle={certificationNote}
      />

      <div className="grid md:grid-cols-2 gap-6">
        {certificationCategories.map((cat) => (
          <div key={cat.name} className="cyber-panel p-6 rounded-xl">
            <h3 className="label-cyber mb-4">{cat.name}</h3>
            <div className="flex flex-wrap gap-2">
              {cat.items.map((cert) => (
                <span
                  key={cert}
                  className="text-sm font-body px-3 py-1.5 bg-white/[0.06] border border-white/10 text-readable-muted rounded"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Certifications;
