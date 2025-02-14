import React from "react"

export const ThemeBtn: React.FC = () => {

    const [theme, setTheme ] = React.useState<'light' | 'dark'>('light')

    const changeTheme = React.useCallback((t: 'light' | 'dark') => {

        setTheme(t)

        if (t === 'dark') {
            document.body.classList.toggle("dark", true)
        } else {
            document.body.classList.toggle("dark", false)
        }

    }, [setTheme])

    React.useEffect(() => {
        // Add listener to update styles
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => changeTheme(e.matches ? 'dark' : 'light'));
    
        // Setup dark/light mode for the first time
        changeTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    
        // Remove listener
        return () => {
            window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', () => {});
        }
    }, [changeTheme]);

    return (
    
        <button className="border-2 border-black rounded-md py-1.5 px-4  hover:bg-slate-200" 
        onClick={_ => theme === 'dark' ? changeTheme('light') : changeTheme('dark')}
        >D</button>
    )
}