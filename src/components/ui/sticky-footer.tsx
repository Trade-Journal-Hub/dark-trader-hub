import React from 'react';
import { cn } from '@/lib/utils';
import { motion, useReducedMotion } from 'motion/react';
import {
	FacebookIcon,
	FrameIcon,
	InstagramIcon,
	LinkedinIcon,
	YoutubeIcon,
} from 'lucide-react';
import { Button } from './button';
import { DotPattern } from './dot-pattern';

interface FooterLink {
	title: string;
	href: string;
	icon?: React.ComponentType<{ className?: string }>;
}
interface FooterLinkGroup {
	label: string;
	links: FooterLink[];
}

type StickyFooterProps = React.ComponentProps<'footer'>;

export function StickyFooter({ className, ...props }: StickyFooterProps) {
	return (
		<footer
			className={cn('relative h-[500px] w-full', className)}
			style={{ clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)' }}
			{...props}
		>
			<div className="fixed bottom-0 h-[500px] w-full">
				<div className="sticky top-[calc(100vh-500px)] h-full overflow-y-auto">
					<div className="relative flex size-full flex-col justify-between gap-5 border-t border-white/10 px-4 py-8 md:px-12 bg-black overflow-hidden">
						{/* Elegant Dot Pattern Background */}
						<div className="absolute inset-0 z-0">
							{/* CSS-based dot pattern for better visibility */}
							<div 
								className="absolute inset-0 opacity-30"
								style={{
									backgroundImage: `
										radial-gradient(circle at 1px 1px, rgba(34, 211, 238, 0.8) 1px, transparent 0)
									`,
									backgroundSize: '20px 20px',
									backgroundPosition: '0 0, 10px 10px'
								}}
							></div>
							{/* Subtle gradient overlay for depth */}
							<div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/40"></div>
						</div>
						<div className="relative z-10 mt-6 flex flex-col gap-6 md:flex-row xl:mt-0">
							<AnimatedContainer className="w-full md:w-1/2 lg:w-2/5 space-y-4">
								<div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
									TradeJournal PRO
								</div>
								<p className="text-gray-300 text-base leading-relaxed">
									The ultimate trading journal for serious traders. Track, analyze, and optimize your trading performance.
								</p>
								<div className="flex gap-3">
									{socialLinks.map((link) => (
										<Button key={link.title} size="icon" variant="outline" className="size-10 hover:bg-cyan-400/10 hover:border-cyan-400/50 hover:scale-110 transition-all duration-300">
											<link.icon className="size-5" />
										</Button>
									))}
								</div>
							</AnimatedContainer>
							
							<div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
								{footerLinkGroups.map((group, index) => (
									<AnimatedContainer
										key={group.label}
										delay={0.1 + index * 0.1}
										className="w-full"
									>
										<div>
											<h3 className="text-sm uppercase text-white font-semibold mb-4">{group.label}</h3>
											<ul className="text-gray-300 space-y-3 text-sm">
												{group.links.map((link) => (
													<li key={link.title}>
														<a
															href={link.href}
															className="hover:text-cyan-400 inline-flex items-center transition-all duration-300 hover:translate-x-1"
														>
															{link.icon && <link.icon className="me-2 size-4" />}
															{link.title}
														</a>
													</li>
												))}
											</ul>
										</div>
									</AnimatedContainer>
								))}
							</div>
						</div>
						<div className="relative z-10 text-gray-300 flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-4 text-sm md:flex-row">
							<p>© 2024 TradeJournal Pro. All rights reserved. 🇮🇳 Made in India for Indian Traders</p>
							<div className="flex items-center space-x-4 text-xs text-gray-400">
								<span>SEBI Registered</span>
								<span>•</span>
								<span>ISO 27001 Certified</span>
								<span>•</span>
								<span>256-bit SSL</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}

const socialLinks = [
	{ title: 'Facebook', href: '#', icon: FacebookIcon },
	{ title: 'Instagram', href: '#', icon: InstagramIcon },
	{ title: 'Youtube', href: '#', icon: YoutubeIcon },
	{ title: 'LinkedIn', href: '#', icon: LinkedinIcon },
];

const footerLinkGroups: FooterLinkGroup[] = [
	{
		label: 'Product',
		links: [
			{ title: 'Features', href: '/features' },
			{ title: 'Pricing', href: '/pricing' },
			{ title: 'Dashboard', href: '/dashboard' },
			{ title: 'Analytics', href: '/dashboard/analytics' },
		],
	},
	{
		label: 'Support',
		links: [
			{ title: 'Contact Us', href: '/contact' },
			{ title: 'Help Center', href: '/contact' },
			{ title: 'Trading Guides', href: '/features' },
			{ title: 'Settings', href: '/dashboard/settings' },
		],
	},
	{
		label: 'Account',
		links: [
			{ title: 'Login', href: '/login' },
			{ title: 'Register', href: '/register' },
			{ title: 'Reset Password', href: '/forgot-password' },
			{ title: 'Privacy Policy', href: '#' },
		],
	},
];

type AnimatedContainerProps = React.ComponentProps<typeof motion.div> & {
	children?: React.ReactNode;
	delay?: number;
};

function AnimatedContainer({
	delay = 0.1,
	children,
	...props
}: AnimatedContainerProps) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return children;
	}

	return (
		<motion.div
			initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
			whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
			viewport={{ once: true }}
			transition={{ delay, duration: 0.8 }}
			{...props}
		>
			{children}
		</motion.div>
	);
}
