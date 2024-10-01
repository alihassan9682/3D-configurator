const ToggleButton = ({ activeView, toggleView, viewName, children }) => (
    <button
        onClick={() => toggleView(viewName)}
        className={`px-4 py-2 rounded-full transition duration-300 ${activeView === viewName
            ? "bg-gray-700 text-white"
            : "bg-gray-300 text-gray-700"
            }`}
        style={{
            borderTopRightRadius: viewName === "AR" ? 0 : 'inherit',
            borderBottomRightRadius: viewName === "AR" ? 0 : 'inherit',
        }}
    >
        <div className="flex items-center gap-2">
            {children}
        </div>
    </button>
);
