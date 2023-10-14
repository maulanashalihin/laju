<script>
    import {Link} from '@inertiajs/svelte';
    export let username = 'Maulana';
</script>
<div>
    halo {username}
    <div>
        <Link href="/about"> cool
        </Link>
    </div>
</div>