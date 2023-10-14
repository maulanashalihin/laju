<script>
    import {Link} from '@inertiajs/svelte';
    
    export let session; 
</script>
<div>
    halo {session.user.name}
    <div>
 
        <Link as="button" href="/logout" method="POST"> Logout
        </Link>
    </div>
</div>