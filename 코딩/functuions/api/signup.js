export async function onRequestPost(context) {
    try {
        const { id, pw, univ, name, exam, examDateStr } = await context.request.json();
        const kv = context.env.USERS;

        const existing = await kv.get(id);
        if (existing) {
            return new Response(JSON.stringify({ success: false, message: "이미 존재하는 아이디입니다." }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const userData = { id, pw, univ, name, exam, examDateStr, records: [], events: {} };
        await kv.put(id, JSON.stringify(userData));

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        return new Response(JSON.stringify({ success: false, message: e.message }), { status: 500 });
    }
}