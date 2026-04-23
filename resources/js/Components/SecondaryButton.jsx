export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            type={type}
            className={
                `inline-flex items-center justify-center px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-sm text-slate-700 shadow-sm transition-all duration-200 ease-in-out hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-[0.98] ${
                    disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
