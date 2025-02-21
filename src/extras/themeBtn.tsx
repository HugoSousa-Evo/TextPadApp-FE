import React from "react"
import { IoMoon } from "react-icons/io5"
import { IoSunny } from "react-icons/io5"

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
    
        <button className="border-2 border-black rounded-md py-1.5 px-4  hover:bg-slate-200 justify-self-end h-10 mr-2 mt-2" 
        onClick={_ => theme === 'dark' ? changeTheme('light') : changeTheme('dark')}
        >
            {
                theme === 'dark' && <IoSunny />
            }
            {
                theme === 'light' && <IoMoon />
            }
        </button>
    )
}