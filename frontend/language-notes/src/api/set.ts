export async function fetchSets(pageId: number, token: string): Promise<SetDetails[]> {
    try {
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

    const response = await fetch(`http://localhost:8080/set`, {
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