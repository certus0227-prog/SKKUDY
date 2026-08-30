export async function onRequestPost(context) {
    try {
        const { id, pw } = await context.request.json();
        const kv = context.env.USERS;

        const dataStr = await kv.get(id);
        if (!dataStr) {
            return new Response(JSON.stringify({ success: false }), { headers: { 'Content-Type': 'application/json' } });
        }

        const user = JSON.parse(dataStr);
        if (user.pw !== pw) {
            return new Response(JSON.stringify({ success: false }), { headers: { 'Content-Type': 'application/json' } });
        }

        return new Response(JSON.stringify({ success: true, user }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        return new Response(JSON.stringify({ success: false, message: e.message }), { status: 500 });
    }
}