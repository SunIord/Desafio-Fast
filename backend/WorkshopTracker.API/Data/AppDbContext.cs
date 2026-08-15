using Microsoft.EntityFrameworkCore;
using WorkshopTracker.API.Models;
using BCrypt.Net;

namespace WorkshopTracker.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Colaborador> Colaboradores => Set<Colaborador>();
    public DbSet<Workshop> Workshops => Set<Workshop>();
    public DbSet<Presenca> Presencas => Set<Presenca>();
    public DbSet<Usuario> Usuarios => Set<Usuario>();

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

        modelBuilder.Entity<Usuario>()
            .HasIndex(u => u.Username)
            .IsUnique();

        // Criação do usuário padrão para login
        modelBuilder.Entity<Usuario>().HasData(new Usuario
        {
            Id = 1,
            Username = "admin",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123")
        });
    }
}