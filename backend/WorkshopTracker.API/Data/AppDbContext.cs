using Microsoft.EntityFrameworkCore;
using WorkshopTracker.API.Models;

namespace WorkshopTracker.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Colaborador> Colaboradores => Set<Colaborador>();
    public DbSet<Workshop> Workshops => Set<Workshop>();
    public DbSet<Presenca> Presencas => Set<Presenca>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Presenca>()
            .HasIndex(p => new { p.WorkshopId, p.ColaboradorId })
            .IsUnique();
        
        modelBuilder.Entity<Presenca>()
            .HasOne(p => p.Colaborador)
            .WithMany(w => w.Presencas)
            .HasForeignKey(p => p.ColaboradorId)
            .OnDelete(DeleteBehavior.Restrict);
        
        modelBuilder.Entity<Presenca>()
            .HasOne(p => p.Workshop)
            .WithMany(w => w.Presencas)
            .HasForeignKey(p => p.WorkshopId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}