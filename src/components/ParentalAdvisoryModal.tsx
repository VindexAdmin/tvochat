import React from 'react';
import { AlertTriangle, Shield, Users, Eye, X } from 'lucide-react';

interface ParentalAdvisoryModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export const ParentalAdvisoryModal: React.FC<ParentalAdvisoryModalProps> = ({
  isOpen,
  onAccept,
  onDecline
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-red-500/30 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 border-b border-red-500/30 p-6 rounded-t-2xl">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Aviso Parental</h2>
              <p className="text-red-200 text-sm">Control de Edad y Responsabilidad</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Age Warning */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-200 mb-2">Restricción de Edad</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Este servicio está destinado <strong>únicamente para personas mayores de 18 años</strong>. 
                  Al continuar, confirmas que tienes al menos 18 años de edad.
                </p>
              </div>
            </div>
          </div>

          {/* Content Warning */}
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <Eye className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-orange-200 mb-2">Contenido No Moderado</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Las videollamadas no están moderadas. Puedes encontrar contenido inapropiado, 
                  ofensivo o perturbador. Usa este servicio bajo tu propia responsabilidad.
                </p>
              </div>
            </div>
          </div>

          {/* Safety Guidelines */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <Users className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-200 mb-2">Pautas de Seguridad</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• No compartas información personal</li>
                  <li>• Reporta comportamiento inapropiado</li>
                  <li>• Desconéctate si te sientes incómodo</li>
                  <li>• Mantén conversaciones respetuosas</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Legal Disclaimer */}
          <div className="bg-gray-800/50 border border-gray-600/30 rounded-xl p-4">
            <h3 className="font-semibold text-gray-200 mb-2">Descargo de Responsabilidad</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Al usar este servicio, aceptas que TVO no se hace responsable por el contenido 
              generado por otros usuarios, interacciones que puedan ocurrir, o cualquier daño 
              que pueda resultar del uso de esta plataforma. Usas este servicio bajo tu propio 
              riesgo y responsabilidad.
            </p>
          </div>

          {/* Confirmation */}
          <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-3">
              <input 
                type="checkbox" 
                id="ageConfirm" 
                className="w-4 h-4 text-purple-500 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
                required
              />
              <label htmlFor="ageConfirm" className="text-sm text-white font-medium">
                Confirmo que tengo 18 años o más
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="termsAccept" 
                className="w-4 h-4 text-purple-500 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
                required
              />
              <label htmlFor="termsAccept" className="text-sm text-white font-medium">
                Acepto los términos y condiciones de uso
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-gray-700/50 p-6 flex space-x-3">
          <button
            onClick={onDecline}
            className="flex-1 px-4 py-3 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 rounded-xl font-medium text-gray-300 transition-all flex items-center justify-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>Cancelar</span>
          </button>
          <button
            onClick={() => {
              const ageConfirm = document.getElementById('ageConfirm') as HTMLInputElement;
              const termsAccept = document.getElementById('termsAccept') as HTMLInputElement;
              
              if (ageConfirm?.checked && termsAccept?.checked) {
                onAccept();
              } else {
                alert('Debes confirmar tu edad y aceptar los términos para continuar.');
              }
            }}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl font-medium text-white transition-all flex items-center justify-center space-x-2 shadow-lg"
          >
            <Shield className="w-4 h-4" />
            <span>Acepto y Continúo</span>
          </button>
        </div>
      </div>
    </div>
  );
};