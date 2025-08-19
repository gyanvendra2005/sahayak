import LectureModel  from "models/Lecture";

export async function GET(request: Request,  params: any ) {
  const { id } = params;

  try {
     const response = await LectureModel.findById(id);
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