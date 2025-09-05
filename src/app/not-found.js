// pages/404.js
import LinkButton from './components/button';

export default function Custom404() {
    return (
        <div className="flex flex-col items-center justify-start pt-16">
            <h1 className="text-4xl text-white font-bold">404 - Page Not Found</h1>
            <p className="text-lg text-white mb-8">
                Sorry, we couldn't find the page you were looking for.
            </p>
            <LinkButton text="Go Back Home" link="https://nirvekpandey.com" />
        </div>
    );
}
