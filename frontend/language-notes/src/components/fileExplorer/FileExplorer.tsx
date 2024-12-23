import React, { useState, useEffect } from "react";

type FileExplorerProps = {
  setChosenSetIdCallback: (setId: number) => void;
};

type PageNode = {
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

  const toggleFolder = (path: string) => {
    setOpenedPages((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const handleSetClick = (setId: number) => {
    props.setChosenSetIdCallback(setId);
  };

  useEffect(() => {
    const fetchSets = async (pageId: string) => {
      try {
        const response = await fetch(`http://localhost:8080/page/${pageId}/sets`);
        if (!response.ok) {
          throw new Error("Failed to fetch sets");
        }
        const data = await response.json();
        return data.map((set: any) => ({
          id: set.id,
          name: set.name,
        }));
      } catch (error) {
        console.error("Error fetching sets:", error);
        return [];
      }
    };

    const fetchPages = async (userId: string, language: string) => {
      try {
        const response = await fetch(
          `http://localhost:8080/book/${userId}/pages?language=${language}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch pages");
        }
        const data = await response.json();
        return data.map((page: any) => ({
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
        "f47c1a1b-2e71-4960-878d-cd70db13264e",
        "chinese"
      );

      for (const page of fetchedPages) {
        const sets = await fetchSets(page.id);
        setPages((prev) => [
          ...prev,
          {
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
            <li key={pagePath} className="mb-1">
              {/* Page (Folder) */}
              <button
                className="flex items-center p-1 hover:bg-gray-200 rounded-md w-full text-left pl-2"
                onClick={() => toggleFolder(pagePath)}
              >
                <span className="mr-2">{isOpen ? "📂" : "📁"}</span>
                <span>{page.name}</span>
              </button>
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
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="w-full bg-gray-100 border border-gray-300 p-2 rounded-md">
      <h2 className="text-lg font-bold p-2">File Explorer</h2>
      {renderFileTree(pages)}
    </div>
  );
};

export default FileExplorer;
