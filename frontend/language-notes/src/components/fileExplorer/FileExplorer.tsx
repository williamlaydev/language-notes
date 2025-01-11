import React, { useState, useEffect, useContext} from "react";
import { SupabaseContext } from '../../main.tsx'

type FileExplorerProps = {
  setChosenSetIdCallback: (setId: number) => void;
};

type PageNode = {
  id: number;
  name: string;
  sets: SetNode[];
};

type SetNode = {
  id: number;
  name: string;
};

const FileExplorer: React.FC<FileExplorerProps> = (props: FileExplorerProps) => {
  const [pages, setPages] = useState<PageNode[]>([]);
  const [openedPages, setOpenedPages] = useState<Record<string, boolean>>({});
  const [editingPage, setEditingPage] = useState<string | null>(null);
  const [newPageName, setNewPageName] = useState("");
  const [editingSet, setEditingSet] = useState<string | null>(null);
  const [newSetName, setNewSetName] = useState("");

  const supabase = useContext(SupabaseContext)

  const toggleFolder = (path: string) => {
    setOpenedPages((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const handleSetClick = (setId: number) => {
    props.setChosenSetIdCallback(setId);
  };

  const addPage = () => {
    setEditingPage("new-page");
    setNewPageName("");
  };

  const confirmAddPage = async () => {
    if (newPageName.trim()) {
      
      try {
        const {data, error} = await supabase.auth.getSession()
        if (error) {
          throw new Error("Error fetching session: " + error.message)
        }

        const token = data?.session?.access_token

        const response = await fetch("http://localhost:8080/page", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            bookId: 2, // TODO: Replace with the actual bookId as needed
            name: newPageName.trim(),
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create page");
        }

        const newPage = await response.json();

        setPages((prev) => [
          ...prev,
          {
            id: newPage.id,
            name: newPage.name,
            sets: [],
          },
        ]);
      } catch (error) {
        console.error("Error adding page:", error);
      }
    }

    setEditingPage(null);
    setNewPageName("");
  };

  const addSet = (pageId: number) => {
    setEditingSet(pageId.toString());
    setNewSetName("");
  };

  const confirmAddSet = async (pageId: number) => {
    if (newSetName.trim()) {
      try {
        const {data, error} = await supabase.auth.getSession()
        if (error) {
          throw new Error("Error fetching session: " + error.message)
        }

        const token = data?.session?.access_token

        const response = await fetch("http://localhost:8080/set", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            pageId,
            name: newSetName.trim(),
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create set");
        }

        const newSet = await response.json();

        setPages((prev) =>
          prev.map((page) =>
            page.id === pageId
              ? {
                  ...page,
                  sets: [...page.sets, { id: newSet.id, name: newSet.name }],
                }
              : page
          )
        );
      } catch (error) {
        console.error("Error adding set:", error);
      }
    }

    setEditingSet(null);
    setNewSetName("");
  };

  useEffect(() => {
    const fetchSets = async (pageId: number) => {
      try {
        const {data, error} = await supabase.auth.getSession()
        if (error) {
          throw new Error("Error fetching session: " + error.message)
        }

        const token = data?.session?.access_token

        const response = await fetch(`http://localhost:8080/page/${pageId}/sets`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch sets");
        }
        const sets = await response.json();
        return sets.map((set: any) => ({
          id: set.id,
          name: set.name,
        }));
      } catch (error) {
        console.error("Error fetching sets:", error);
        return [];
      }
    };

    const fetchPages = async (language: string) => {
      try {
        const {data, error} = await supabase.auth.getSession()
        if (error) {
          throw new Error("Error fetching session: " + error.message)
        }

        const token = data?.session?.access_token

        const response = await fetch(`http://localhost:8080/book/pages?language=${language}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch pages");
        }
        const pages = await response.json();
        return pages.map((page: any) => ({
          id: page.id,
          name: page.name,
        }));
      } catch (error) {
        console.error("Error fetching pages:", error);
        return [];
      }
    };

    const initializePages = async () => {
      const fetchedPages = await fetchPages(
        "chinese"
      );

      for (const page of fetchedPages) {
        const sets = await fetchSets(page.id);
        setPages((prev) => [
          ...prev,
          {
            id: page.id,
            name: page.name,
            sets,
          },
        ]);
      }
    };

    initializePages();
  }, []);

  const renderFileTree = (pages: PageNode[], path = "") => {
    return (
      <ul className="p-2 pl-4">
        {pages.map((page) => {
          const pagePath = `${path}/${page.name}`;
          const isOpen = openedPages[pagePath];

          return (
            <li key={page.id} className="mb-1">
              {/* Page (Folder) */}
              <div className="flex items-center">
                <button
                  className="flex items-center p-1 hover:bg-gray-200 rounded-md w-full text-left pl-2"
                  onClick={() => toggleFolder(pagePath)}
                >
                  <span className="mr-2">{isOpen ? "📂" : "📁"}</span>
                  <span>{page.name}</span>
                </button>
                <button
                  className="ml-2 text-blue-600 hover:text-blue-800"
                  onClick={() => addSet(page.id)}
                >
                  ➕
                </button>
              </div>
              {/* Render Sets if the page is open */}
              {isOpen && (
                <ul className="pl-6">
                  {page.sets.map((set) => (
                    <li key={set.id}>
                      <button
                        className="flex items-center p-1 hover:bg-gray-200 rounded-md w-full text-left pl-6"
                        onClick={() => handleSetClick(set.id)}
                      >
                        <span className="mr-2">📄</span>
                        <span>{set.name}</span>
                      </button>
                    </li>
                  ))}
                  {/* New Set Input */}
                  {editingSet === page.id.toString() && (
                    <li className="flex items-center">
                      <input
                        type="text"
                        value={newSetName}
                        onChange={(e) => setNewSetName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            confirmAddSet(page.id);
                          } else if (e.key === "Escape") {
                            setEditingSet(null);
                          }
                        }}
                        className="p-1 border border-gray-300 rounded-md mr-2"
                        placeholder="Enter set name"
                      />
                      <button
                        onClick={() => confirmAddSet(page.id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        ✅
                      </button>
                    </li>
                  )}
                </ul>
              )}
            </li>
          );
        })}
        {/* New Page Input */}
        {editingPage === "new-page" && (
          <li className="flex items-center">
            <input
              type="text"
              value={newPageName}
              onChange={(e) => setNewPageName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  confirmAddPage();
                } else if (e.key === "Escape") {
                  setEditingPage(null);
                }
              }}
              className="p-1 border border-gray-300 rounded-md mr-2"
              placeholder="Enter page name"
            />
            <button
              onClick={confirmAddPage}
              className="text-green-600 hover:text-green-800"
            >
              ✅
            </button>
          </li>
        )}
      </ul>
    );
  };

  return (
    <div className="w-full bg-gray-100 border border-gray-300 p-2 rounded-md">
      <h2 className="text-lg font-bold p-2">Chinese</h2>
      <button
        onClick={addPage}
        className="mb-2 text-blue-600 hover:text-blue-800"
      >
        ➕ Add Page
      </button>
      {renderFileTree(pages)}
    </div>
  );
};

export default FileExplorer;
