import { getOrm } from "@/lib/db";
import { HistoricalRequest } from "@/lib/entities";
import { wrap } from "@mikro-orm/core";
import { NextRequest, NextResponse } from "next/server";



export async function GET(
    req : NextRequest,
    {params} : {params : Promise<{id : string}>}
){
  const param = await params;
  console.log("get function in id is called")
    const orm = await getOrm();

    console.log("orm is here ", orm)
    if(!orm){
        return NextResponse.json({ message: 'Database not initialized' }, { status: 500 });
    }
    const em = orm.em.fork()

    const id = parseInt(param.id)

    if(isNaN(id)){
        return NextResponse.json({ message: 'Invalid request id' }, { status: 400 });
    }

    try {
        const request = await em.findOne(HistoricalRequest, id);
    
        if (!request) {
          return NextResponse.json({ message: 'Request not found' }, { status: 404 });
        }
    
        return NextResponse.json(wrap(request).toObject());
      } catch (error: unknown) {
        console.error('API GET /requests/[id] error:', error);
        return NextResponse.json(
          { message: 'Failed to fetch historical request', error: error },
          { status: 500 }
        );
      }
}


export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) {

    const param = await params
    const orm = await getOrm();
    if (!orm) {
      return NextResponse.json({ message: 'Database not initialized' }, { status: 500 });
    }
    const em = orm.em.fork();
  
    const id = parseInt(param.id);
  
    if (isNaN(id)) {
      return NextResponse.json({ message: 'Invalid request ID' }, { status: 400 });
    }
  
    try {
      const requestToDelete = await em.findOne(HistoricalRequest, id);
  
      if (!requestToDelete) {
        return NextResponse.json({ message: 'Request not found' }, { status: 404 });
      }
  
      await em.removeAndFlush(requestToDelete);
      return NextResponse.json({ message: 'Request deleted successfully' });
    } catch (error: unknown) {
      console.error('API DELETE /requests/[id] error:', error);
      return NextResponse.json(
        { message: 'Failed to delete historical request', error: error },
        { status: 500 }
      );
    }
  }