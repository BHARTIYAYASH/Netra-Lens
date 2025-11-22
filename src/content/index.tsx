import ReactDOM from 'react-dom/client';
import styles from '../index.css?inline';

const Overlay = () => {
    return (
        <div className="fixed top-0 left-0 z-[9999] pointer-events-none w-full h-full">
            {/* Example Overlay Box */}
            <div className="absolute top-10 left-10 bg-flexoki-yellow border-2 border-flexoki-text shadow-neo p-2 pointer-events-auto hidden group-hover:block">
                <p className="font-bold text-flexoki-text">Netra Active</p>
            </div>
            <style>{styles}</style>
        </div>
    );
};

const rootId = 'netra-indic-lens-root';
let rootElement = document.getElementById(rootId);

if (!rootElement) {
    rootElement = document.createElement('div');
    rootElement.id = rootId;
    document.body.appendChild(rootElement);

    // Shadow DOM to isolate styles
    const shadowRoot = rootElement.attachShadow({ mode: 'open' });
    const appRoot = document.createElement('div');
    shadowRoot.appendChild(appRoot);

    const root = ReactDOM.createRoot(appRoot);
    root.render(<Overlay />);
}
