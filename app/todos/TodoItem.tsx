const TodoItem = ({children, handleClick}: { children: any, handleClick: () => void }) => (
    <div
        className={'bg-gray-50 dark:bg-gray-800 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-sm transition ease-in-out duration-400  hover:cursor-pointer select-none text-gray-800 dark:text-gray-100 w-full'}
        onClick={handleClick}
    >
        {children}
    </div>
);

export default TodoItem;