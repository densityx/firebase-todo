const Button = ({name, className, handleClick}: { name: string, className?: string, handleClick: () => void }) => (
    <button
        className={`rounded-xl px-4 py-3 bg-blue-400 hover:bg-blue-500 font-semibold text-white transition-colors duration-300 ease-in-out ${className}`}
        onClick={handleClick}
    >
        {name}
    </button>
);

export default Button;