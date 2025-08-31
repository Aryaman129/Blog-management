import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail, Code2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
export function Footer() {
  const currentYear = new Date().getFullYear();
  const socialLinks = [{
    href: 'https://github.com',
    icon: Github,
    label: 'GitHub'
  }, {
    href: 'https://twitter.com',
    icon: Twitter,
    label: 'Twitter'
  }, {
    href: 'https://linkedin.com',
    icon: Linkedin,
    label: 'LinkedIn'
  }, {
    href: 'mailto:contact@example.com',
    icon: Mail,
    label: 'Email'
  }];
  const quickLinks = [{
    href: '/',
    label: 'Home'
  }, {
    href: '/blog',
    label: 'Blog'
  }, {
    href: '/projects',
    label: 'Projects'
  }];
  return <footer className="mt-20 border-t border-border/40 bg-surface/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 group mb-4">
              <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <Code2 className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">TechHub</span>
            </Link>
            
            <p className="text-muted-foreground mb-4 max-w-md">
              A platform for sharing technical insights, project showcases, and knowledge across the developer community.
            </p>
            
            <div className="flex space-x-2">
              {socialLinks.map(({
              href,
              icon: Icon,
              label
            }) => <Button key={label} variant="ghost" size="icon" asChild className="hover:bg-surface-elevated hover:text-primary transition-colors">
                  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                    <Icon className="h-4 w-4" />
                  </a>
                </Button>)}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map(({
              href,
              label
            }) => <li key={href}>
                  <Link to={href} className="text-muted-foreground hover:text-primary transition-colors">
                    {label}
                  </Link>
                </li>)}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Get Involved</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Want to contribute content?</p>
              <p>Share your projects and insights with the community.</p>
              <Button variant="outline" size="sm" className="mt-4 border-primary/20 hover:bg-primary hover:text-white transition-colors" asChild>
                <a href="mailto:contribute@example.com">
                  <Mail className="h-4 w-4 mr-2" />
                  Contribute
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground">
            © {currentYear} TechHub. A community-driven platform for developers.
          </div>
          
          <div className="flex items-center space-x-1 text-sm text-muted-foreground mt-4 md:mt-0">
            <span>Built with</span>
            <Heart className="h-4 w-4 text-red-500 mx-1" />
            <span>by the community</span>
          </div>
        </div>
      </div>
    </footer>;
}
