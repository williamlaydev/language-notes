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