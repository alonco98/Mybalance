```javascript
import './globals.css';

export const metadata = {
  title: 'MyBalance App',
  description: 'Track your locksmith jobs and earnings',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen bg-gray-100">
          {children}
        </main>
      </body>
    </html>
  );
}
```
