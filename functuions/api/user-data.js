export async function onRequestGet(context) {
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');
    const kv = context.env.USERS;

    const dataStr = await kv.get(id);
    if (!dataStr) {
        return new Response(JSON.stringify({ records: [], events: {} }), { headers: { 'Content-Type': 'application/json' } });
    }

    const user = JSON.parse(dataStr);
    return new Response(JSON.stringify({ records: user.records || [], events: user.events || {} }), {
        headers: { 'Content-Type': 'application/json' }
    });
}