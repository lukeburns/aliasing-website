<script>
  import { onMount } from 'svelte';

  let w;
  let origin = import.meta.env.VITE_ORIGIN;
  let wallet;
  let input;

  let name = '';
  let available = null;
  let data;
  let alias;

  $: if (name) { fetch(`/${name.toLowerCase()}?json`).then(r => r.json()).then(d => data = d).catch(console.error) } else { data = undefined }
  $: if (data && data.alias) { alias = data.alias.split('.').slice(-1)[0] } else { alias = undefined }
  $: if (alias) { isAvailable(alias).then(a => available = a).catch(console.error) } else { available = null }
  $: if (w) { insertParam('name', name) }

  onMount(async () => {
    w = window;
    name = 'luke'
    origin = origin || window.location.hostname

    const url = new URL(window.location)
    const n = url.searchParams.get('name')
    name = n

    if (bob3) {
      wallet = bob3.connect()
      wallet = await wallet
    }

    setTimeout(() => {
      input.focus();
    }, 10)
  });

  async function isAvailable (tld) {
    if (wallet instanceof Promise) {
      wallet = await wallet
    }

    if (wallet) {
      try {
        await wallet.sendRedeem(tld)
        return false
      } catch (err) {
        if (err.message.indexOf('No reveals to redeem') === 0) {
          return false
        } else {
          return true
        }
      }
    } else {
      return null
    }
  }

  function insertParam(key,value) {
    if (history.pushState) {
      const path = window.location.protocol + "//" + window.location.host + window.location.pathname + (value ? ('?' + key + '=' + value) : '');
      window.history.pushState({ path }, '', path);
    }
  }
</script>

<svelte:head>
  <title>{data ? data.name : `dsub`}</title>
  <link rel="stylesheet" type="text/css" href="/fonts.css">
</svelte:head>

<main>
  <h2>Register a {origin ? `.${origin} ` : ''}domain!</h2>
  <article>
    <input bind:this={input} bind:value={name} placeholder="luke">{origin ? `.${origin} ` : ''}
    {#if name.length > 0 && data}
        <div class="info">
          <div>The domain</div>
          <p><a href={`http://${data.name}/`}>{data.name}</a></p>
          <div>aliased by</div>
          <p><a href={`http://${data.alias}/`}>{data.alias}</a></p>
          <div>
            {#if available !== null}
              {#if available === true}
                looks like it's <strong>available!</strong> Place your bid.
              {:else}
                is unavailable.
              {/if}
          {:else}
            may be available. Check below!
          {/if}
        </div>
      </div>
      <div class="register"><a class="button bob-wallet" href={`bob://openname?name=${alias}`}>{available ? 'Bid' : 'Open'} with Bob Wallet</a> <a class="button" href={`https://niami/domain/${alias}`}>{available ? 'Bid' : 'Open'} in Niami</a> <a class="button" href={`https://www.namebase.io/domains/${alias}`}>{available ? 'Bid' : 'Open'} on Namebase</a></div>
    {:else}
      <p>Search to find the domain you'd like!</p>
    {/if}
  </article>
  <aside>
    <h3>Prelaunch (bid at your own risk)</h3>
    <p><emph>For any TLD that is aliasing SLDs, make sure you verify that the TLD owner <a href="https://github.com/handshake-org/hsd/pull/567">relinquishes control</a> before you bid, so that no one can take your SLD away.</emph> I have not yet done this, which means .dsub SLDs are not yet trustless! I intend to once the protocol looks like it's sufficiently stable to justify launching for real.</p>
    <a class="bob" href="https://chrome.google.com/webstore/detail/bob-extension/ogcmjchbmdichlfelhmceldndgmgpcem"><img src="/bob.gif" /></a>
    <h3>About .{origin} domains</h3>
    <p>.{origin} is an experimental permissionless namespace — anyone can register SLDs by bidding on aliases that live on the Handshake blockchain.</p>
    <p>To resolve .{origin} domains, you'll need a dns resolver capable of resolving the <a href="https://github.com/lukeburns/hipr-aliasing"><code>aliasing</code></a> protocol.</p>
    <p>If you're interested in aliasing your TLD, feel free to reach out on <a href="https://discord.gg/BSEzc7kY">Discord</a>. You can reserve SLDs prior to launch and will retain full control over the TLD itself (like this website).</p>
    <p>Made with &lt;3 by <a href="https://lukeburns/">lukeburns</a>.</p>
  </aside>
</main>

<style>
  main {
    font-family: "Computer Modern Sans", Helvetica, sans-serif;
    margin: 3em 5em;
    text-align: center;
  }
  aside {
    margin-top: 3em;
  }
  emph {
    font-style: italic;
  }
  .bob {
    position: absolute;
    top: 1em;
    right: 1em;
  }
  .info, input {
    font-family: "Computer Modern Bright", Helvetica, sans-serif;
  }
  .info {
    margin: 3em;
  }
  .info a {
    color: #5469d4;
    text-decoration: none;
  }
  .info p {
    font-size: 1.35em;
    margin: 0.4em;
    display: flex;
    justify-content: center;
  }
  .button {
    border: 0;
    outline: 0;
    cursor: pointer;
    color: white;
    background-color: rgb(84, 105, 212);
    box-shadow: rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 12%) 0px 1px 1px 0px, rgb(84 105 212) 0px 0px 0px 1px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(60 66 87 / 8%) 0px 2px 5px 0px;
    border-radius: 4px;
    font-size: 1em;
    font-weight: 500;
    padding: 4px 8px;
    display: inline-block;
    text-decoration: none;
  }
  .button:hover {
    color: rgb(60, 66, 87);
    background-color: rgb(255, 255, 255);
    box-shadow: rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 12%) 0px 1px 1px 0px, rgb(60 66 87 / 16%) 0px 0px 0px 1px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(60 66 87 / 8%) 0px 2px 5px 0px;
  }
  @media only screen and (max-width: 600px) {
    .bob, .bob-wallet {
      display: none;
    }
    .info p {
      font-size: 1em;
    }
  }
</style>