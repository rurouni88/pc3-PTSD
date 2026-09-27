// Icon — renders a named icon from the SVG sprite.
// All icons are stroke-based, 24x24 viewBox, 2px stroke.
// Usage: <Icon name="wifi" size={24} className="text-primary" />

export interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 24, className = '' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <use href={`/icons/sprite.svg#${name}`} />
    </svg>
  );
}
