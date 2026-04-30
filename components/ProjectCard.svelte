<script>
  export let title;
  export let tech;
  export let description;
</script>

<div class="card">
  <h3>{title}</h3>
  <span class="tech-tag">{tech}</span>
  <p>{description}</p>
</div>

<style>
  .card {
    border: 1px solid #eee;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    transition: transform 0.2s;
  }
  .card:hover { transform: translateY(-5px); }
  h3 { margin-top: 0; color: #ff3e00; }
  .tech-tag {
    font-size: 0.8rem;
    color: #666;
    background: #f0f0f0;
    padding: 2px 8px;
    border-radius: 4px;
  }
</style>