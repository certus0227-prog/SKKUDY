export async function onRequestPost(context) {
    try {
        const { request, env } = context;
        if (!env.USERS) {
            return new Response(JSON.stringify({ error: "Server KV (USERS) is not bound." }), { status: 500, headers: { "Content-Type": "application/json" } });
        }

        const data = await request.json();
        const { id, pw, univ, exam, examDateStr } = data;

        if (!id || !pw || !univ || !exam || !examDateStr) {
            return new Response(JSON.stringify({ error: "모든 필드를 입력해주세요." }), { status: 400, headers: { "Content-Type": "application/json" } });
        }

        const existing = await env.USERS.get(id);
        if (existing) {
            return new Response(JSON.stringify({ error: "이미 존재하는 아이디입니다." }), { status: 400, headers: { "Content-Type": "application/json" } });
        }

        const newUser = {
            id,
            pw,
            name: id,
            univ,
            exam,
            examDateStr,
            records: [],
            events: {}
        };

        await env.USERS.put(id, JSON.stringify(newUser));

        return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
}
