export async function fetchSets(pageId: number, token: string): Promise<SetDetails[]> {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/page/${pageId}/sets`, {
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
      return sets.map((set: {id: number, name:string}) => ({
        id: set.id,
        name: set.name,
      }));
  
    } catch (error) {
      console.error("Error fetching sets:", error);
      return [];
    }
};

export async function createNewSet(pageId: number, name: string, token: string): Promise<boolean> {
  try {
    const reqBody = {
      name: name,
      pageId: pageId
    }

    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/set`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(reqBody)
    });

    if (!response.ok) {
      throw new Error("Failed to create sets");
    }

    return true
  } catch (error) {
    console.error("Error creating new set:", error);
    return false
  }
}

export async function deleteSet(setId: number, token: string) {
  await fetch(`${import.meta.env.VITE_SERVER_URL}/set/${setId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })
}