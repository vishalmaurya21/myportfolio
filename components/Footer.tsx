import React from 'react';
import { Twitter, Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: Twitter, href: 'https://twitter.com/whoviishal', label: 'Twitter' },
        { icon: Github, href: 'https://github.com/vishalmaurya21', label: 'GitHub' },
        { icon: Linkedin, href: 'https://linkedin.com/in/vishalmaurya21', label: 'LinkedIn' },
        { icon: Mail, href: 'mailto:iamviishalkumar@gmail.com', label: 'Email' },
    ];

    const navLinks = [
        { label: 'Home', href: '#home' },
        { label: 'About', href: '#about' },
        { label: 'Projects', href: '#projects' },
        { label: 'Contact', href: '#contact' },
    ];

    return (
        <footer className="relative z-10 w-full bg-background/40 backdrop-blur-md border-t border-border py-12">
            <div className="container mx-auto px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Logo and Tagline */}
                    <div className="flex flex-col space-y-4">
                        <h2 className="text-2xl font-bold text-foreground tracking-widest uppercase">
                            Vishal <span className="text-[#e31616]">Maurya</span>
                        </h2>
                        <p className="text-muted-foreground max-w-xs">
                            Building modern, high-performance web experiences with a focus on creative coding and seamless animations.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">Quick Links</h3>
                        <ul className="space-y-2">
                            {navLinks.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-muted-foreground hover:text-[#e31616] transition-colors duration-300"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social Connect */}
                    <div className="flex flex-col space-y-6">
                        <h3 className="text-lg font-semibold text-foreground">Connect</h3>
                        <div className="flex space-x-4">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-secondary rounded-full hover:bg-[#e31616] hover:text-white text-muted-foreground transition-all duration-300"
                                        aria-label={social.label}
                                    >
                                        <Icon size={20} />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-muted-foreground text-sm">
                    <p>© {currentYear} Vishal Maurya. All rights reserved.</p>
                    <div className="flex space-x-8">
                        <a href="#" className="hover:text-[#e31616] transition-colors uppercase tracking-tight">Privacy Policy</a>
                        <a href="#" className="hover:text-[#e31616] transition-colors uppercase tracking-tight">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
