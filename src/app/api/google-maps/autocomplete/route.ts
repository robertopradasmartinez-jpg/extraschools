import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const input = searchParams.get('input');

    console.log('🔍 Autocomplete API llamada con input:', input);

    if (!input || input.length < 3) {
      return NextResponse.json({ predictions: [] });
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      console.error('❌ Google Maps API key no configurada');
      return NextResponse.json(
        { error: 'Google Maps API key not configured' },
        { status: 500 }
      );
    }

    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      input
    )}&key=${apiKey}&language=es&components=country:es`;

    console.log('📡 Llamando a Google Maps API...');
    const response = await fetch(url);
    const data = await response.json();
    console.log('📦 Respuesta de Google:', data.status, '- Predicciones:', data.predictions?.length || 0);

    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error in autocomplete API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch autocomplete suggestions' },
      { status: 500 }
    );
  }
}
