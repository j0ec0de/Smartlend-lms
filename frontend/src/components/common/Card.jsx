import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function Card({ children, className, ...props }) {
    return (
        <div
            className={twMerge(clsx('bg-white shadow rounded-lg p-6', className))}
            {...props}
        >
            {children}
        </div>
    );
}
