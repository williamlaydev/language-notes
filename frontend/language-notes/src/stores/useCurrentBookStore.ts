import {create} from 'zustand';

interface BookData {
    id: number;
    name: string;
    language: string;
    setCurrentBookData: (book: Book) => void
}

const useCurrentBookStore = create<BookData>()((set) => ({
    id: -1,
    name: "",
    language: "",
    setCurrentBookData: async (book: Book) => {
        set(() => ({
            id: book.id,
            name: book.name,
            language: book.language
        }))
    }
}))

export default useCurrentBookStore