import React from 'react';

interface DatasetType {
  name: string;
  type: string;
}

interface TypeBadgeProps {
  datasetType: DatasetType[];
}

const borderTypeColor = [
  { keywords: ['string'], color: 'border-yellow-500 text-yellow-500' },
  { keywords: ['f64', 'number'], color: 'border-green-200 text-green-200' },
  { keywords: ['video', 'audio'], color: 'border-orange-300 text-orange-300' },
  { keywords: ['application'], color: 'border-blue-400 text-blue-400' },
  { keywords: ['image'], color: 'border-[#F05FC5] text-[#F05FC5]' },
];

const TypeBadge: React.FC<TypeBadgeProps> = ({ datasetType }) => {
  if (!datasetType || datasetType.length === 0) {
    return <span className="text-muted-foreground">No type</span>;
  }
  return (
    <div className="w-36">
      {datasetType.map((type, index) => {
        const borderColor = borderTypeColor.find((color) =>
          color.keywords.some((keyword) =>
            type.type.toLowerCase().includes(keyword)
          )
        )?.color;
        return (
          <span
            key={index}
            className={`mr-1 rounded-full border px-4 py-2 text-xs ${borderColor}`}
          >
            {type.name}: {type.type}
          </span>
        );
      })}
    </div>
  );
};

export default TypeBadge;
