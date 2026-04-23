export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-br from-indigo-600 to-indigo-700 border border-transparent rounded-xl font-semibold text-sm text-white shadow-lg shadow-indigo-200/50 hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 ease-in-out active:scale-[0.98] ${
                    disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
