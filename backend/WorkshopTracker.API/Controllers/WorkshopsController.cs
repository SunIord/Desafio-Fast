using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WorkshopTracker.API.Data;
using WorkshopTracker.API.DTOs;
using WorkshopTracker.API.Models;

namespace WorkshopTracker.API.Controllers;

[ApiController]
[Route("api/workshops")]
public class WorkshopsController : ControllerBase
{
    private readonly AppDbContext _context;

    public WorkshopsController(AppDbContext context)
    {
        _context = context;
    }

    // GET /api/workshops
    [HttpGet]
    public async Task<ActionResult<IEnumerable<WorkshopResponseDto>>> GetAll()
    {
        var workshops = await _context.Workshops
            .Select(w => new WorkshopResponseDto
            {
                Id = w.Id,
                Nome = w.Nome,
                DataRealizacao = w.DataRealizacao,
                Descricao = w.Descricao
            })
            .ToListAsync();

        return Ok(workshops);
    }

    // GET /api/workshops/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<WorkshopDetailDto>> GetById(int id)
    {
        var workshop = await _context.Workshops
            .Include(w => w.Presencas)
                .ThenInclude(p => p.Colaborador)
            .FirstOrDefaultAsync(w => w.Id == id);

        if (workshop is null)
            return NotFound(new { mensagem = $"Workshop com Id {id} não encontrado." });

        var dto = new WorkshopDetailDto
        {
            Id = workshop.Id,
            Nome = workshop.Nome,
            DataRealizacao = workshop.DataRealizacao,
            Descricao = workshop.Descricao,
            ColaboradoresPresentes = workshop.Presencas
                .Select(p => new ColaboradorPresenteDto
                {
                    Id = p.Colaborador.Id,
                    Nome = p.Colaborador.Nome
                })
                .ToList()
        };

        return Ok(dto);
    }

    // POST /api/workshops
    [HttpPost]
    public async Task<ActionResult<WorkshopResponseDto>> Create(WorkshopCreateDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Nome))
            return BadRequest(new { mensagem = "O campo Nome é obrigatório." });

        var workshop = new Workshop
        {
            Nome = dto.Nome,
            DataRealizacao = dto.DataRealizacao,
            Descricao = dto.Descricao
        };

        _context.Workshops.Add(workshop);
        await _context.SaveChangesAsync();

        var response = new WorkshopResponseDto
        {
            Id = workshop.Id,
            Nome = workshop.Nome,
            DataRealizacao = workshop.DataRealizacao,
            Descricao = workshop.Descricao
        };

        return CreatedAtAction(nameof(GetById), new { id = workshop.Id }, response);
    }

    // PUT /api/workshops/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, WorkshopUpdateDto dto)
    {
        var workshop = await _context.Workshops.FindAsync(id);
        if (workshop is null)
            return NotFound(new { mensagem = $"Workshop com Id {id} não encontrado." });

        if (string.IsNullOrWhiteSpace(dto.Nome))
            return BadRequest(new { mensagem = "O campo Nome é obrigatório." });

        workshop.Nome = dto.Nome;
        workshop.DataRealizacao = dto.DataRealizacao;
        workshop.Descricao = dto.Descricao;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE /api/workshops/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var workshop = await _context.Workshops.FindAsync(id);
        if (workshop is null)
            return NotFound(new { mensagem = $"Workshop com Id {id} não encontrado." });
        
        var possuiPresencas = await _context.Presencas
            .AnyAsync(p => p.WorkshopId == id);
        
        if (possuiPresencas)
            return Conflict(new
            {
                mensagem = "Não é possível excluir este workshop pois ele possui presenças registradas."
            });

        _context.Workshops.Remove(workshop);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}