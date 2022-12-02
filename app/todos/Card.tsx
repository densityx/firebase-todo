const Card = ({className, children}: { className: string, children: any }) => (
    <div className={`p-8 rounded-xl shadow-sm bg-white dark:bg-gray-900 ${className}`}>
        {children}
    </div>
)

export default Card;