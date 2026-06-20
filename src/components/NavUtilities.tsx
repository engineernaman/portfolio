import SoundSystem from './SoundSystem';
import ThemeSwitcher from './ThemeSwitcher';

const NavUtilities = () => (
  <div className="flex items-center gap-1.5">
    <SoundSystem compact />
    <ThemeSwitcher />
  </div>
);

export default NavUtilities;
