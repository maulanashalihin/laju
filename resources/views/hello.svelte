<script>
    export let name = 'world';
</script>
<div>
   {#each [...Array(10).keys()] as i}
    <div>{i}. Hello {name}!</div>
   {/each}
</div>