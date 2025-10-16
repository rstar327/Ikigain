module.exports = {
    darkMode: ['class'],
    content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './results/**/*.{js,ts,jsx,tsx}',

  ],
  theme: {
  	extend: {
  		colors: {
  			true_blue: {
  				'100': '#011428',
  				'200': '#022950',
  				'300': '#023d78',
  				'400': '#0352a0',
  				'500': '#0466c8',
  				'600': '#0f85fa',
  				'700': '#4ba3fb',
  				'800': '#87c2fd',
  				'900': '#c3e0fe',
  				DEFAULT: '#0466c8'
  			},
  			yale_blue: {
  				'100': '#000c19',
  				'200': '#011932',
  				'300': '#01254b',
  				'400': '#023164',
  				'500': '#023e7d',
  				'600': '#0363c9',
  				'700': '#1d89fc',
  				'800': '#68b0fd',
  				'900': '#b4d8fe',
  				DEFAULT: '#023e7d'
  			},
  			oxford_blue: {
  				'100': '#00050e',
  				'200': '#000a1d',
  				'300': '#000f2b',
  				'400': '#001439',
  				'500': '#001845',
  				'600': '#00389f',
  				'700': '#0056f7',
  				'800': '#508dff',
  				'900': '#a7c6ff',
  				DEFAULT: '#001845'
  			},
  			oxford_blue_alt: {
  				'100': '#00040a',
  				'200': '#000714',
  				'300': '#000b1f',
  				'400': '#000e29',
  				'500': '#001233',
  				'600': '#00328f',
  				'700': '#0052eb',
  				'800': '#4788ff',
  				'900': '#a3c3ff',
  				DEFAULT: '#001233'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		fontFamily: {
  			sans: ['Poppins', ...defaultTheme.fontFamily.sans],
  		}
  	}
  },
        
  plugins: [require("tailwindcss-animate")],
}
