import LectureModel  from "models/Lecture";

export async function GET(request: Request,  context: any  ) {
  // const { id } = params;
  const { id } = context.params;
  if (!id) {
    console.log('Lecture ID is missing in the request parameters');
    
    return new Response(JSON.stringify({ error: 'Lecture ID is required' }), { status: 400 });
  }

  try {
     const response = await LectureModel.findById(id);
     console.log(id);
     
     console.log(response);
     
     if(!response) {
       return new Response(JSON.stringify({ error: 'Lecture not found' }), { status: 404 });
     }
     console.log('Fetched  data:', response);
     
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },})
  } catch (error) {
    console.error('Error fetching lecture data:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch lecture data' }), { status: 500 });
  }
}