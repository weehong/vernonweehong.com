/** The icon set (docs/design/components.md, Icons): stroke only, decorative. */

type IconProps = { readonly className?: string };

const stroke =
	"fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round]";

export function ArrowIcon({
	className = "size-4",
}: IconProps): React.ReactElement {
	return (
		<svg
			viewBox="0 0 16 16"
			aria-hidden
			className={`${className} ${stroke} [stroke-width:1.5]`}
		>
			<path d="M3 8h10M9 4l4 4-4 4" />
		</svg>
	);
}

export function ArrowUpRightIcon({
	className = "size-4",
}: IconProps): React.ReactElement {
	return (
		<svg
			viewBox="0 0 16 16"
			aria-hidden
			className={`${className} ${stroke} [stroke-width:1.5]`}
		>
			<path d="M5 11l6-6M6 5h5v5" />
		</svg>
	);
}

export function MoonIcon({
	className = "size-5",
}: IconProps): React.ReactElement {
	return (
		<svg
			viewBox="0 0 20 20"
			aria-hidden
			className={`${className} ${stroke} [stroke-width:1.5]`}
		>
			<path d="M16.5 12.2A7 7 0 0 1 7.8 3.5a7 7 0 1 0 8.7 8.7z" />
		</svg>
	);
}

export function SunIcon({
	className = "size-5",
}: IconProps): React.ReactElement {
	return (
		<svg
			viewBox="0 0 20 20"
			aria-hidden
			className={`${className} ${stroke} [stroke-width:1.5]`}
		>
			<circle cx="10" cy="10" r="3.5" />
			<path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.3 4.3l1.4 1.4M14.3 14.3l1.4 1.4M4.3 15.7l1.4-1.4M14.3 5.7l1.4-1.4" />
		</svg>
	);
}

export function MailIcon({
	className = "size-4",
}: IconProps): React.ReactElement {
	return (
		<svg
			viewBox="0 0 16 16"
			aria-hidden
			className={`${className} ${stroke} [stroke-width:1.5]`}
		>
			<rect x="2" y="3.5" width="12" height="9" rx="1.5" />
			<path d="M2.5 4.5L8 9l5.5-4.5" />
		</svg>
	);
}

export function SearchIcon({
	className = "size-6",
}: IconProps): React.ReactElement {
	return (
		<svg
			viewBox="0 0 24 24"
			aria-hidden
			className={`${className} ${stroke} [stroke-width:1.75]`}
		>
			<circle cx="10.5" cy="10.5" r="6.5" />
			<path d="M15.5 15.5L21 21" />
		</svg>
	);
}

export function MenuIcon({
	className = "size-5",
}: IconProps): React.ReactElement {
	return (
		<svg
			viewBox="0 0 20 20"
			aria-hidden
			className={`${className} ${stroke} [stroke-width:1.5]`}
		>
			<path d="M3 6h14M3 10h14M3 14h14" />
		</svg>
	);
}

export function CloseIcon({
	className = "size-5",
}: IconProps): React.ReactElement {
	return (
		<svg
			viewBox="0 0 20 20"
			aria-hidden
			className={`${className} ${stroke} [stroke-width:1.5]`}
		>
			<path d="M5 5l10 10M15 5L5 15" />
		</svg>
	);
}

export function RssIcon({
	className = "size-4",
}: IconProps): React.ReactElement {
	return (
		<svg
			viewBox="0 0 16 16"
			aria-hidden
			className={`${className} ${stroke} [stroke-width:1.5]`}
		>
			<path d="M3 3a10 10 0 0 1 10 10M3 7a6 6 0 0 1 6 6" />
			<circle cx="3.5" cy="12.5" r="1" />
		</svg>
	);
}

export function DownloadIcon({
	className = "size-4",
}: IconProps): React.ReactElement {
	return (
		<svg
			viewBox="0 0 16 16"
			aria-hidden
			className={`${className} ${stroke} [stroke-width:1.5]`}
		>
			<path d="M8 2v8M4.5 6.5L8 10l3.5-3.5M3 13h10" />
		</svg>
	);
}

/* Callout icons (docs/design/components.md, Callout): 20×20, stroke 1.5. */

export function InfoIcon({
	className = "size-5",
}: IconProps): React.ReactElement {
	return (
		<svg
			viewBox="0 0 20 20"
			aria-hidden
			className={`${className} ${stroke} [stroke-width:1.5]`}
		>
			<circle cx="10" cy="10" r="7.5" />
			<path d="M10 9v4.5M10 6.5v.01" />
		</svg>
	);
}

export function LightbulbIcon({
	className = "size-5",
}: IconProps): React.ReactElement {
	return (
		<svg
			viewBox="0 0 20 20"
			aria-hidden
			className={`${className} ${stroke} [stroke-width:1.5]`}
		>
			<path d="M10 2.5a5 5 0 0 0-3 9c.6.5 1 1.2 1 2v1h4v-1c0-.8.4-1.5 1-2a5 5 0 0 0-3-9zM8 17h4" />
		</svg>
	);
}

export function FlagIcon({
	className = "size-5",
}: IconProps): React.ReactElement {
	return (
		<svg
			viewBox="0 0 20 20"
			aria-hidden
			className={`${className} ${stroke} [stroke-width:1.5]`}
		>
			<path d="M4.5 17.5v-14M4.5 3.5h10l-2 3.5 2 3.5h-10" />
		</svg>
	);
}

export function TriangleIcon({
	className = "size-5",
}: IconProps): React.ReactElement {
	return (
		<svg
			viewBox="0 0 20 20"
			aria-hidden
			className={`${className} ${stroke} [stroke-width:1.5]`}
		>
			<path d="M10 3l8 14H2zM10 8v4M10 14.5v.01" />
		</svg>
	);
}

export function OctagonIcon({
	className = "size-5",
}: IconProps): React.ReactElement {
	return (
		<svg
			viewBox="0 0 20 20"
			aria-hidden
			className={`${className} ${stroke} [stroke-width:1.5]`}
		>
			<path d="M7 2.5h6L17.5 7v6L13 17.5H7L2.5 13V7zM10 6.5v4M10 13.5v.01" />
		</svg>
	);
}
