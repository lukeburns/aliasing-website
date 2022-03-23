<script>
  import { onMount } from 'svelte';

  let origin = import.meta.env.VITE_ORIGIN;
  let wallet;
  let input;

  let name = 'luke';
  let available = null;
  let data;
  let alias;
  $: fetch(`/${name.toLowerCase()}`).then(r => r.json()).then(d => data = d).catch(console.error)
  $: if (data && data.alias) { alias = data.alias.split('.').slice(-1)[0] }
  $: if (alias) isAvailable(alias).then(a => available = a).catch(console.error)

  onMount(async () => {
    origin = origin || window.location.hostname
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
        await wallet.sendBid(tld)
        return false
      } catch (err) {
        if (err.message.indexOf('Name is not available') === 0) {
          return false
        } else {
          return true
        }
      }
    } else {
      return null
    }
  }
</script>

<svelte:head>
  <link rel="stylesheet" type="text/css" href="/fonts.css">
</svelte:head>

<main>
  <h2>Register a {origin ? `.${origin} ` : ''}domain!</h2>
  <article>
    <input bind:this={input} bind:value={name} placeholder="luke">{origin ? `.${origin} ` : ''}
    {#if name.length > 0 && data}
        <div class="info">
          <div>The domain</div>
          <p><a onclick="window.location.href=`http://{data.name}/`" href={`http://${data.name}/`}>{data.name}</a></p>
          <div>aliased by</div>
          <p><a onclick="window.location.href=`http://{data.alias}/`" href={`http://${data.alias}/`}>{data.alias}</a></p>
          <div>
            {#if available !== null}
              {#if available === true}
                is <strong>available!</strong> Place your bid.
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
    <h3>About .{origin} domains</h3>
    <p>.{origin} is an experimental permissionless namespace — anyone can register SLDs by bidding on aliases that live on the Handshake blockchain.</p>
    <p>To resolve .{origin} domains, you'll need a dns resolver capable of resolving the <a href="https://github.com/lukeburns/hipr-aliasing"><code>aliasing</code></a> protocol. <emph>Note: this protocol may change, so don't go registering a bunch of names all willy nilly.</emph></p>
    <p>If you're interested in aliasing your TLD, feel free to reach out on <a href="https://discord.gg/BSEzc7kY">Discord</a>. You'll have first dibs on SLDs, which you can then sell on the market.</p>
    <p>Made with &lt;3 by <a onclick="window.location.href=`http://lukeburns/`" href="http://lukeburns/">lukeburns</a>.</p>
  </aside>
  <a class="bob" href="https://chrome.google.com/webstore/detail/bob-extension/ogcmjchbmdichlfelhmceldndgmgpcem"><img src="/bob.gif" /></a>
</main>

<style>
  main {
    font-family: "Computer Modern Sans", Helvetica, sans-serif;
    margin: 5em;
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