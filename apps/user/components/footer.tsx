import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Brand Section */}
        <div>
          <h1 className="text-2xl font-bold text-teal-600">SkillNest</h1>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Empower your future with hands-on learning.  
            Learn from experts and gain real-world skills.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-teal-500">Home</Link></li>
            <li><Link href="/searchpage" className="hover:text-teal-500">Courses</Link></li>
            <li><Link href="/about" className="hover:text-teal-500">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-teal-500">Contact</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Resources</h2>
          <ul className="space-y-2 text-sm">
            <li><Link href="/faq" className="hover:text-teal-500">FAQs</Link></li>
            <li><Link href="/blog" className="hover:text-teal-500">Blog</Link></li>
            <li><Link href="/privacy" className="hover:text-teal-500">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-teal-500">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Follow Us</h2>
          <div className="flex space-x-4">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-teal-500">
              🐦 Twitter
            </a>
            <a href="https://linkedin.com/in/gyanvendra2004" target="_blank" rel="noopener noreferrer" className="hover:text-teal-500">
              💼 LinkedIn
            </a>
            <a href="https://github.com/gyanvendra2005" target="_blank" rel="noopener noreferrer" className="hover:text-teal-500">
              💻 GitHub
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-300 dark:border-gray-700 mt-6 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
        © {new Date().getFullYear()} SkillNest. All rights reserved.
      </div>
    </footer>
  );
}
