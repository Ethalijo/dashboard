import './globals.css';
import 'leaflet/dist/leaflet.css';

export const metadata = {
  title: 'UAE Transport | Demo',
  description: 'Mobile public transport usability mock-up with simulated journeys and credit balance.'
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
