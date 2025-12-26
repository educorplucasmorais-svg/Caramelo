import type { Pet } from '../types/pet';
import './PetCard.css';

interface PetCardProps {
  pet: Pet;
  onAdotar?: (pet: Pet) => void;
}

export function PetCard({ pet, onAdotar }: PetCardProps) {
  const tipoEmoji = pet.tipo === 'cachorro' ? '🐕' : pet.tipo === 'gato' ? '🐱' : '🐾';

  return (
    <div className="pet-card">
      <div className="pet-image-container">
        {pet.imagem ? (
          <img src={pet.imagem} alt={pet.nome} className="pet-image" />
        ) : (
          <div className="pet-image-placeholder">{tipoEmoji}</div>
        )}
        {pet.disponivel && <span className="badge-disponivel">Disponível</span>}
      </div>
      
      <div className="pet-info">
        <h3 className="pet-nome">
          {tipoEmoji} {pet.nome}
        </h3>
        <p className="pet-raca">{pet.raca}</p>
        <p className="pet-idade">{pet.idade} {pet.idade === 1 ? 'ano' : 'anos'}</p>
        <p className="pet-descricao">{pet.descricao}</p>
        
        {pet.disponivel && onAdotar && (
          <button className="btn-adotar" onClick={() => onAdotar(pet)}>
            💛 Quero Adotar
          </button>
        )}
      </div>
    </div>
  );
}
