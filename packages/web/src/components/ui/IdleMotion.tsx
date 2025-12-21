export default function IdleMotion() {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
			<title>idle motion</title>
			<g>
				<path d="M18 23 L50 35 L20 65" fill="oklch(0.8 0.125 151)" />
				<path d="M50 35 L20 65 L50 75" fill="oklch(0.8 0.15 156)" />
				<path d="M82 23 L50 35 L50 75" fill="oklch(0.8 0.15 161)" />
				<path d="M82 23 L50 75 L80 65" fill="oklch(0.8 0.15 171)" />
			</g>
			<g>
				<circle cx="20" cy="25" r="5" fill="oklch(0.85 0.2 151)">
					<animate
						attributeName="r"
						values="5;7;5"
						dur="1.2s"
						repeatCount="indefinite"
						begin="0s"
						calcMode="spline"
						keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
					/>
				</circle>
				<circle cx="50" cy="35" r="5" fill="oklch(0.85 0.2 161)">
					<animate
						attributeName="r"
						values="5;7;5"
						dur="1.2s"
						repeatCount="indefinite"
						begin="0.2s"
						calcMode="spline"
						keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
					/>
				</circle>
				<circle cx="80" cy="25" r="5" fill="oklch(0.87 0.18 169)">
					<animate
						attributeName="r"
						values="5;7;5"
						dur="1.2s"
						repeatCount="indefinite"
						begin="0.4s"
						calcMode="spline"
						keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
					/>
				</circle>
				<circle cx="20" cy="65" r="5" fill="oklch(0.8 0.08 151)">
					<animate
						attributeName="r"
						values="5;7;5"
						dur="1.2s"
						repeatCount="indefinite"
						begin="0.6s"
						calcMode="spline"
						keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
					/>
				</circle>
				<circle cx="50" cy="75" r="5" fill="oklch(0.8 0.08 161)">
					<animate
						attributeName="r"
						values="5;7;5"
						dur="1.2s"
						repeatCount="indefinite"
						begin="0.8s"
						calcMode="spline"
						keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
					/>
				</circle>
				<circle cx="80" cy="65" r="5" fill="oklch(0.8 0.08 171)">
					<animate
						attributeName="r"
						values="5;7;5"
						dur="1.2s"
						repeatCount="indefinite"
						begin="1.0s"
						calcMode="spline"
						keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
					/>
				</circle>
			</g>
		</svg>
	);
}
