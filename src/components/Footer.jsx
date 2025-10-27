const Footer = () => {
  return (
    <footer className="bg-slate-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-primary-400 mb-4">EventHub</h3>
            <p className="text-slate-300 text-sm">
              Your go-to platform for discovering and managing amazing events.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/events" className="text-slate-300 hover:text-primary-400 transition">
                  Browse Events
                </a>
              </li>
              <li>
                <a href="/about" className="text-slate-300 hover:text-primary-400 transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-slate-300 hover:text-primary-400 transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <p className="text-slate-300 text-sm">
              Follow us on social media for the latest updates and events.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-6 text-center text-sm text-slate-400">
          <p>&copy; 2025 EventHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
